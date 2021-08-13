/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cli.commands;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Splitter;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.Options;
import org.cmdbuild.ecql.EcqlId;
import org.cmdbuild.ecql.EcqlSource;
import org.cmdbuild.ecql.utils.EcqlUtils;
import org.cmdbuild.utils.cli.utils.CliAction;
import org.cmdbuild.utils.cli.utils.CliCommand;
import org.cmdbuild.utils.cli.utils.CliCommandParser;
import static org.cmdbuild.utils.cli.utils.CliCommandParser.printActionHelp;
import org.cmdbuild.utils.cli.utils.CliCommandUtils;
import static org.cmdbuild.utils.cli.utils.CliCommandUtils.prepareAction;
import static org.cmdbuild.utils.cli.utils.CliUtils.hasInteractiveConsole;
import org.cmdbuild.utils.crypto.Cm3EasyCryptoUtils;
import org.cmdbuild.utils.crypto.Cm3PasswordUtils;
import org.cmdbuild.utils.crypto.CmLegacyPasswordUtils;
import static org.cmdbuild.utils.hash.CmHashUtils.hash;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class CryptoCommandRunner extends AbstractCommandRunner {

    private final Map<String, CliAction> actions;

    public CryptoCommandRunner() {
        super("crypto", "manage encrypted stuff (encrypt/decrypt password, etc)");
        actions = new CliCommandParser().parseActions(this);
    }

    @Override
    protected Options buildOptions() {
        Options options = super.buildOptions();
        return options;
    }

    @Override
    protected void printAdditionalHelp() {
        System.out.println("\navailable  methods:");
        printActionHelp(actions);
    }

    @Override
    protected void exec(CommandLine cmd) throws Exception {
        Iterator<String> iterator = cmd.getArgList().iterator();
        CliCommandUtils.ExecutableAction action = prepareAction(actions, iterator);
        action.execute();
    }

    @CliCommand
    protected void encryptLegacy(String value) {
        String encryptedPsw = CmLegacyPasswordUtils.encrypt(checkNotNull(value));
        if (hasInteractiveConsole()) {
            System.out.println("=== BEGIN encrypted value ===\n" + encryptedPsw + "\n=== END encrypted value ===");
        } else {
            System.out.println(encryptedPsw);
        }
    }

    @CliCommand
    protected void decryptLegacy(String value) {
        String decryptedPsw = CmLegacyPasswordUtils.decrypt(checkNotNull(value));
        if (hasInteractiveConsole()) {
            System.out.println("=== BEGIN decrypted value ===\n" + decryptedPsw + "\n=== END decrypted value ===");
        } else {
            System.out.println(decryptedPsw);
        }
    }

    @CliCommand
    protected void encryptCm3easy(String value) {
        String encryptedPsw = Cm3EasyCryptoUtils.encryptValue(checkNotNull(value));
        if (hasInteractiveConsole()) {
            System.out.println("=== BEGIN encrypted value ===\n" + encryptedPsw + "\n=== END encrypted value ===");
        } else {
            System.out.println(encryptedPsw);
        }
    }

    @CliCommand
    protected void decryptCm3easy(String value) {
        String decryptedPsw = Cm3EasyCryptoUtils.decryptValueOrFail(checkNotBlank(value));
        if (hasInteractiveConsole()) {
            System.out.println("=== BEGIN decrypted value ===\n" + decryptedPsw + "\n=== END decrypted value ===");
        } else {
            System.out.println(decryptedPsw);
        }
    }

    @CliCommand
    protected void encryptCm3(String value) {
        String encryptedPsw = Cm3PasswordUtils.hash(checkNotNull(value));
        if (hasInteractiveConsole()) {
            System.out.println("=== BEGIN encrypted value ===\n" + encryptedPsw + "\n=== END encrypted value ===");
        } else {
            System.out.println(encryptedPsw);
        }
    }

    @CliCommand
    protected void encryptEcqlId(String value) {
        List<String> values = Splitter.on(",").splitToList(value);
        String encodedId = EcqlUtils.buildEcqlId(parseEnum(values.get(0), EcqlSource.class), values.subList(1, values.size()).toArray(new String[]{}));
        if (hasInteractiveConsole()) {
            System.out.println("=== BEGIN encrypted value ===\n" + encodedId + "\n=== END encrypted value ===");
        } else {
            System.out.println(encodedId);
        }
    }

    @CliCommand
    protected void decryptEcqlId(String value) {
        String decryptedPsw = Cm3EasyCryptoUtils.decryptValue(checkNotNull(value));
        EcqlId ecqlId = EcqlUtils.parseEcqlId(decryptedPsw);
        if (hasInteractiveConsole()) {
            System.out.println("=== BEGIN decrypted value ===\n" + ecqlId + "\n=== END decrypted value ===");
        } else {
            System.out.println(ecqlId);
        }
    }

    @CliCommand
    protected void hashfile(String value) throws IOException {
        try (InputStream in = new FileInputStream(value)) {
            String hash = hash(in);
            System.out.printf("file hash = %s\n", hash);
        }
    }

}
